import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Note: In a real app, you'd need to verify authentication here
  // For now, we'll skip auth to get the basic functionality working
  
  if (event.httpMethod === 'GET') {
    try {
      const { startDate, endDate, employeeId } = event.queryStringParameters || {};
      
      // Import dependencies dynamically
      const { drizzle } = await import('drizzle-orm/postgres-js');
      const postgres = (await import('postgres')).default;
      const { employeeSchedules, users } = await import('../../shared/schema.ts');
      const { eq, and, gte, lte } = await import('drizzle-orm');
      
      // Create database connection
      const sql = postgres(process.env.DATABASE_URL!, {
        max: 1,
        idle_timeout: 20,
        connect_timeout: 10,
        prepare: false,
        keep_alive: false,
        types: {
          bigint: postgres.BigInt,
        },
      });
      
      const db = drizzle(sql);
      
      let query = db
        .select({
          id: employeeSchedules.id,
          employeeId: employeeSchedules.employeeId,
          scheduleDate: employeeSchedules.scheduleDate,
          startTime: employeeSchedules.startTime,
          endTime: employeeSchedules.endTime,
          position: employeeSchedules.position,
          isMandatory: employeeSchedules.isMandatory,
          notes: employeeSchedules.notes,
          status: employeeSchedules.status,
          createdAt: employeeSchedules.createdAt,
          updatedAt: employeeSchedules.updatedAt,
          employee: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            role: users.role
          }
        })
        .from(employeeSchedules)
        .leftJoin(users, eq(employeeSchedules.employeeId, users.id));

      // Add filters if provided
      const conditions = [];
      
      if (startDate) {
        conditions.push(gte(employeeSchedules.scheduleDate, startDate));
      }
      
      if (endDate) {
        conditions.push(lte(employeeSchedules.scheduleDate, endDate));
      }
      
      if (employeeId) {
        conditions.push(eq(employeeSchedules.employeeId, parseInt(employeeId)));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      const schedules = await query;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(schedules)
      };
    } catch (error) {
      console.error('Schedules API error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          message: 'Failed to fetch schedules',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      };
    }
  } else if (event.httpMethod === 'POST') {
    try {
      // Import dependencies dynamically
      const { drizzle } = await import('drizzle-orm/postgres-js');
      const postgres = (await import('postgres')).default;
      const { employeeSchedules } = await import('../../shared/schema.ts');
      
      // Create database connection
      const sql = postgres(process.env.DATABASE_URL!, {
        max: 1,
        idle_timeout: 20,
        connect_timeout: 10,
        prepare: false,
        keep_alive: false,
        types: {
          bigint: postgres.BigInt,
        },
      });
      
      const db = drizzle(sql);
      
      const scheduleData = JSON.parse(event.body || '{}');
      
      // Validate required fields
      if (!scheduleData.employeeId || !scheduleData.scheduleDate || !scheduleData.startTime || !scheduleData.endTime) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            message: 'Missing required fields: employeeId, scheduleDate, startTime, endTime' 
          })
        };
      }
      
      const newSchedule = await db.insert(employeeSchedules).values({
        employeeId: scheduleData.employeeId,
        scheduleDate: scheduleData.scheduleDate,
        startTime: scheduleData.startTime,
        endTime: scheduleData.endTime,
        position: scheduleData.position || 'server',
        isMandatory: scheduleData.isMandatory || false,
        notes: scheduleData.notes || '',
        status: scheduleData.status || 'scheduled',
        createdBy: null, // Will be set when auth is implemented
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newSchedule[0])
      };
    } catch (error) {
      console.error('Schedule creation error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          message: 'Failed to create schedule',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      };
    }
  } else if (event.httpMethod === 'PUT') {
    try {
      // Import dependencies dynamically
      const { drizzle } = await import('drizzle-orm/postgres-js');
      const postgres = (await import('postgres')).default;
      const { employeeSchedules } = await import('../../shared/schema.ts');
      const { eq } = await import('drizzle-orm');
      
      // Create database connection
      const sql = postgres(process.env.DATABASE_URL!, {
        max: 1,
        idle_timeout: 20,
        connect_timeout: 10,
        prepare: false,
        keep_alive: false,
        types: {
          bigint: postgres.BigInt,
        },
      });
      
      const db = drizzle(sql);
      
      // Extract schedule ID from URL path
      const urlParts = event.path?.split('/') || [];
      const scheduleId = urlParts[urlParts.length - 1];
      
      if (!scheduleId || isNaN(parseInt(scheduleId))) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Invalid schedule ID' })
        };
      }
      
      const scheduleData = JSON.parse(event.body || '{}');
      
      const updatedSchedule = await db.update(employeeSchedules)
        .set({
          employeeId: scheduleData.employeeId,
          scheduleDate: scheduleData.scheduleDate,
          startTime: scheduleData.startTime,
          endTime: scheduleData.endTime,
          position: scheduleData.position,
          isMandatory: scheduleData.isMandatory,
          notes: scheduleData.notes,
          status: scheduleData.status,
          updatedAt: new Date(),
        })
        .where(eq(employeeSchedules.id, parseInt(scheduleId)))
        .returning();
      
      if (updatedSchedule.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Schedule not found' })
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(updatedSchedule[0])
      };
    } catch (error) {
      console.error('Schedule update error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          message: 'Failed to update schedule',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      };
    }
  } else if (event.httpMethod === 'DELETE') {
    try {
      // Import dependencies dynamically
      const { drizzle } = await import('drizzle-orm/postgres-js');
      const postgres = (await import('postgres')).default;
      const { employeeSchedules } = await import('../../shared/schema.ts');
      const { eq } = await import('drizzle-orm');
      
      // Create database connection
      const sql = postgres(process.env.DATABASE_URL!, {
        max: 1,
        idle_timeout: 20,
        connect_timeout: 10,
        prepare: false,
        keep_alive: false,
        types: {
          bigint: postgres.BigInt,
        },
      });
      
      const db = drizzle(sql);
      
      // Extract schedule ID from URL path
      const urlParts = event.path?.split('/') || [];
      const scheduleId = urlParts[urlParts.length - 1];
      
      if (!scheduleId || isNaN(parseInt(scheduleId))) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Invalid schedule ID' })
        };
      }
      
      const deletedSchedule = await db.delete(employeeSchedules)
        .where(eq(employeeSchedules.id, parseInt(scheduleId)))
        .returning();
      
      if (deletedSchedule.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Schedule not found' })
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Schedule deleted successfully' })
      };
    } catch (error) {
      console.error('Schedule deletion error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          message: 'Failed to delete schedule',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      };
    }
  } else {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }
};